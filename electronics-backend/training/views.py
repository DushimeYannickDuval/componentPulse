from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Count, Avg
from django.utils import timezone
from .models import TrainingCategory, TrainingCourse, TrainingModule, Enrollment, Progress
from .serializers import (TrainingCategorySerializer, TrainingCourseSerializer, 
                         TrainingCourseListSerializer, EnrollmentSerializer, 
                         ProgressSerializer)

@api_view(['GET'])
def get_categories(request):
    categories = TrainingCategory.objects.filter(is_active=True)
    serializer = TrainingCategorySerializer(categories, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def get_courses(request):
    courses = TrainingCourse.objects.filter(is_active=True)
    
    # Filter by category
    category_id = request.GET.get('category')
    if category_id:
        courses = courses.filter(category_id=category_id)
    
    # Filter by level
    level = request.GET.get('level')
    if level:
        courses = courses.filter(level=level)
    
    # Search
    search = request.GET.get('search')
    if search:
        courses = courses.filter(title__icontains=search)
    
    courses = courses.order_by('-created_at')
    serializer = TrainingCourseListSerializer(courses, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def get_course(request, course_id):
    course = get_object_or_404(TrainingCourse, id=course_id, is_active=True)
    serializer = TrainingCourseSerializer(course, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def enroll_course(request, course_id):
    try:
        course = TrainingCourse.objects.get(id=course_id, is_active=True)
    except TrainingCourse.DoesNotExist:
        return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if already enrolled
    if Enrollment.objects.filter(user=request.user, course=course).exists():
        return Response({'error': 'Already enrolled in this course'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    # Create enrollment
    enrollment = Enrollment.objects.create(
        user=request.user,
        course=course,
        status='active'
    )
    
    return Response({
        'message': 'Successfully enrolled in course',
        'enrollment': EnrollmentSerializer(enrollment, context={'request': request}).data
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_enrollments(request):
    enrollments = Enrollment.objects.filter(user=request.user).order_by('-enrolled_at')
    serializer = EnrollmentSerializer(enrollments, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_enrollment(request, enrollment_id):
    enrollment = get_object_or_404(Enrollment, id=enrollment_id, user=request.user)
    serializer = EnrollmentSerializer(enrollment, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_module_complete(request, module_id):
    try:
        module = TrainingModule.objects.get(id=module_id)
    except TrainingModule.DoesNotExist:
        return Response({'error': 'Module not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if user is enrolled in the course
    try:
        enrollment = Enrollment.objects.get(
            user=request.user,
            course=module.course,
            status='active'
        )
    except Enrollment.DoesNotExist:
        return Response({'error': 'Not enrolled in this course'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    # Mark module as complete
    progress, created = Progress.objects.get_or_create(
        enrollment=enrollment,
        module=module,
        defaults={'completed': True}
    )
    
    if not created and not progress.completed:
        progress.completed = True
        progress.save()
    
    # Update enrollment progress
    total_modules = module.course.modules.count()
    completed_modules = Progress.objects.filter(
        enrollment=enrollment,
        completed=True
    ).count()
    
    enrollment.progress_percentage = (completed_modules / total_modules) * 100
    
    # Check if course is completed
    if enrollment.progress_percentage == 100:
        enrollment.status = 'completed'
        enrollment.completed_at = timezone.now()
    
    enrollment.save()
    
    return Response({
        'message': 'Module marked as complete',
        'progress': ProgressSerializer(progress, context={'request': request}).data,
        'enrollment_progress': enrollment.progress_percentage
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_course_progress(request, course_id):
    try:
        enrollment = Enrollment.objects.get(
            user=request.user,
            course_id=course_id
        )
    except Enrollment.DoesNotExist:
        return Response({'error': 'Not enrolled in this course'}, 
                       status=status.HTTP_404_NOT_FOUND)
    
    progress_records = Progress.objects.filter(enrollment=enrollment)
    serializer = ProgressSerializer(progress_records, many=True, context={'request': request})
    
    return Response({
        'enrollment': EnrollmentSerializer(enrollment, context={'request': request}).data,
        'progress': serializer.data
    })

@api_view(['GET'])
def training_summary(request):
    """Get training platform statistics"""
    total_courses = TrainingCourse.objects.filter(is_active=True).count()
    total_categories = TrainingCategory.objects.filter(is_active=True).count()
    total_enrollments = Enrollment.objects.count()
    
    # Popular courses
    popular_courses = TrainingCourse.objects.annotate(
        enrollment_count=Count('enrollments')
    ).filter(is_active=True).order_by('-enrollment_count')[:5]
    
    return Response({
        'total_courses': total_courses,
        'total_categories': total_categories,
        'total_enrollments': total_enrollments,
        'popular_courses': TrainingCourseListSerializer(
            popular_courses, many=True, context={'request': request}
        ).data
    })