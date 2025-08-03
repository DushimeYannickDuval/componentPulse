from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.get_categories, name='get_categories'),
    path('courses/', views.get_courses, name='get_courses'),
    path('courses/<int:course_id>/', views.get_course, name='get_course'),
    path('courses/<int:course_id>/enroll/', views.enroll_course, name='enroll_course'),
    path('courses/<int:course_id>/progress/', views.get_course_progress, name='get_course_progress'),
    path('enrollments/', views.get_enrollments, name='get_enrollments'),
    path('enrollments/<int:enrollment_id>/', views.get_enrollment, name='get_enrollment'),
    path('modules/<int:module_id>/complete/', views.mark_module_complete, name='mark_module_complete'),
    path('summary/', views.training_summary, name='training_summary'),
]