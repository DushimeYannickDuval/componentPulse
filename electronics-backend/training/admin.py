from django.contrib import admin
from .models import TrainingCategory, TrainingCourse, TrainingModule, Enrollment, Progress

class TrainingModuleInline(admin.TabularInline):
    model = TrainingModule
    extra = 0

@admin.register(TrainingCategory)
class TrainingCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(TrainingCourse)
class TrainingCourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'level', 'duration_hours', 'price', 'is_active')
    list_filter = ('category', 'level', 'is_active')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [TrainingModuleInline]

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'status', 'progress_percentage', 'enrolled_at')
    list_filter = ('status', 'enrolled_at')
    search_fields = ('user__email', 'course__title')

@admin.register(Progress)
class ProgressAdmin(admin.ModelAdmin):
    list_display = ('enrollment', 'module', 'completed', 'completed_at')
    list_filter = ('completed', 'completed_at')
    search_fields = ('enrollment__user__email', 'module__title')