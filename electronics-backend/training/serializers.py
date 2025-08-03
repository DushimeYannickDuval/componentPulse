from rest_framework import serializers
from .models import TrainingCategory, TrainingCourse, TrainingModule, Enrollment, Progress
from accounts.serializers import UserSerializer

class TrainingCategorySerializer(serializers.ModelSerializer):
    course_count = serializers.SerializerMethodField()
    
    class Meta:
        model = TrainingCategory
        fields = ['id', 'name', 'slug', 'description', 'image', 'course_count', 'is_active']
    
    def get_course_count(self, obj):
        return obj.courses.filter(is_active=True).count()

class TrainingModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingModule
        fields = ['id', 'title', 'description', 'content', 'video_url', 'duration_minutes', 'order']

class TrainingCourseSerializer(serializers.ModelSerializer):
    category = TrainingCategorySerializer(read_only=True)
    modules = TrainingModuleSerializer(many=True, read_only=True)
    enrollment_count = serializers.SerializerMethodField()
    user_enrolled = serializers.SerializerMethodField()
    
    class Meta:
        model = TrainingCourse
        fields = ['id', 'title', 'slug', 'description', 'category', 'level', 
                 'duration_hours', 'price', 'image', 'modules', 'enrollment_count', 
                 'user_enrolled', 'is_active', 'created_at']
    
    def get_enrollment_count(self, obj):
        return obj.enrollments.count()
    
    def get_user_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.enrollments.filter(user=request.user).exists()
        return False

class TrainingCourseListSerializer(serializers.ModelSerializer):
    category = TrainingCategorySerializer(read_only=True)
    enrollment_count = serializers.SerializerMethodField()
    
    class Meta:
        model = TrainingCourse
        fields = ['id', 'title', 'slug', 'description', 'category', 'level', 
                 'duration_hours', 'price', 'image', 'enrollment_count', 'created_at']
    
    def get_enrollment_count(self, obj):
        return obj.enrollments.count()

class EnrollmentSerializer(serializers.ModelSerializer):
    course = TrainingCourseListSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Enrollment
        fields = ['id', 'user', 'course', 'status', 'progress_percentage', 
                 'enrolled_at', 'completed_at']

class ProgressSerializer(serializers.ModelSerializer):
    module = TrainingModuleSerializer(read_only=True)
    
    class Meta:
        model = Progress
        fields = ['id', 'module', 'completed', 'completed_at']