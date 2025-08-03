import os
from pathlib import Path
from decouple import config
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('SECRET_KEY', default='your-secret-key-here-change-in-production')

DEBUG = config('DEBUG', default=True, cast=bool)

ALLOWED_HOSTS = config(
    'ALLOWED_HOSTS', 
    default='localhost,127.0.0.1,0.0.0.0',
    cast=lambda v: [s.strip() for s in v.split(',')]
)

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party apps
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt',  # Added for JWT authentication
    'rest_framework_simplejwt.token_blacklist',  # For token blacklisting
    'corsheaders',
    'django_filters',
    'django_cleanup.apps.CleanupConfig',  # Auto-delete old files
    
    # Local apps
    'accounts',  # Your custom user app
    'products',
    'deals',
    'cart',
    'orders',
    'payments',
    'shipping',
    'reviews',
    'training',
    'support',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'electronics_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'electronics_backend.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': config('DB_ENGINE', default='django.db.backends.sqlite3'),
        'NAME': config('DB_NAME', default=BASE_DIR / 'db.sqlite3'),
        'USER': config('DB_USER', default=''),
        'PASSWORD': config('DB_PASSWORD', default=''),
        'HOST': config('DB_HOST', default=''),
        'PORT': config('DB_PORT', default=''),
        'OPTIONS': {
            'timeout': 20,
            'isolation_level': 'read committed' if config('DB_ENGINE', '') == 'postgresql' else None
        },
    }
}

# Custom user model
AUTH_USER_MODEL = 'accounts.User'

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Africa/Kampala'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',  # Primary JWT auth
        'rest_framework.authentication.TokenAuthentication',  # Fallback token auth
        'rest_framework.authentication.SessionAuthentication',  # For admin/browsable API
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour',
        'cart': '500/hour',  # Specific throttle for cart actions
        'auth': '20/minute',  # Throttle for authentication endpoints
    }
}

# JWT Configuration
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'JTI_CLAIM': 'jti',
    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=60),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=7),
}

# Google OAuth Settings
GOOGLE_CLIENT_ID = config('GOOGLE_CLIENT_ID', default='')
GOOGLE_CLIENT_SECRET = config('GOOGLE_CLIENT_SECRET', default='')

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://your-production-domain.com",
]

CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS.copy()

# Allow all origins in development (be careful with this in production)
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True

# Cart-specific settings
CART_SESSION_ID = 'cart'
CART_ITEM_MAX_QUANTITY = 20  # Maximum quantity per item
CART_TOTAL_MAX_ITEMS = 100   # Maximum total items in cart
CART_CACHE_TIMEOUT = 60 * 15 # 15 minutes cache timeout

# Shipping configuration
UGANDA_LOCATIONS = {
    'Kampala': {'cost': 5000, 'days': 1},
    'Entebbe': {'cost': 7000, 'days': 1},
    'Jinja': {'cost': 8000, 'days': 2},
    'Mbale': {'cost': 12000, 'days': 3},
    'Gulu': {'cost': 15000, 'days': 4},
    'Mbarara': {'cost': 10000, 'days': 3},
    'Fort Portal': {'cost': 12000, 'days': 3},
    'Masaka': {'cost': 8000, 'days': 2},
    'Soroti': {'cost': 13000, 'days': 4},
    'Lira': {'cost': 14000, 'days': 4},
    'Arua': {'cost': 16000, 'days': 5},
    'Kabale': {'cost': 12000, 'days': 4},
    'Kasese': {'cost': 13000, 'days': 4},
    'Mityana': {'cost': 7000, 'days': 2},
    'Mukono': {'cost': 6000, 'days': 1},
}

# Email settings
EMAIL_BACKEND = config(
    'EMAIL_BACKEND',
    default='django.core.mail.backends.console.EmailBackend'  # Console backend for development
)
EMAIL_HOST = config('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default=EMAIL_HOST_USER or 'noreply@componentpulse.ug')

# Email verification settings
EMAIL_VERIFICATION_TIMEOUT = 24 * 60 * 60  # 24 hours in seconds
PASSWORD_RESET_TIMEOUT = 60 * 60  # 1 hour in seconds

# Security settings (only when DEBUG=False)
if not DEBUG:
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'

# Session settings
SESSION_COOKIE_AGE = 60 * 60 * 24 * 7  # 1 week
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'

# Cache configuration (for cart performance and JWT blacklist)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
        'TIMEOUT': 60 * 15,  # 15 minutes
        'OPTIONS': {
            'MAX_ENTRIES': 1000
        }
    }
}

# Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'debug.log'),
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': config('DJANGO_LOG_LEVEL', default='INFO'),
        },
        'cart': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'accounts': {  # Added logging for authentication
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'rest_framework_simplejwt': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}

# File upload settings
FILE_UPLOAD_MAX_MEMORY_SIZE = 5 * 1024 * 1024  # 5MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 5 * 1024 * 1024  # 5MB
DATA_UPLOAD_MAX_NUMBER_FIELDS = 1000

# User profile settings
PROFILE_PICTURE_MAX_SIZE = 2 * 1024 * 1024  # 2MB
ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

# Rate limiting for authentication endpoints
AUTH_RATE_LIMITS = {
    'login_attempts': 5,  # Max login attempts per IP
    'login_timeout': 15 * 60,  # 15 minutes lockout
    'registration_per_ip': 3,  # Max registrations per IP per day
    'password_reset_per_email': 3,  # Max password reset requests per email per day
}

# Social authentication settings
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = GOOGLE_CLIENT_ID
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = GOOGLE_CLIENT_SECRET
SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
]

# API versioning
API_VERSION = 'v1'
API_TITLE = 'Component Pulse API'
API_DESCRIPTION = 'API for Component Pulse Electronics Store'

# Pagination settings
REST_FRAMEWORK_PAGINATION = {
    'DEFAULT_PAGE_SIZE': 20,
    'MAX_PAGE_SIZE': 100,
}

# Search settings
SEARCH_RESULTS_PER_PAGE = 20
SEARCH_MAX_RESULTS = 1000

# Product settings
PRODUCT_IMAGE_MAX_SIZE = 5 * 1024 * 1024  # 5MB
PRODUCT_IMAGES_MAX_COUNT = 10
PRODUCT_REVIEW_MAX_LENGTH = 2000

# Order settings
ORDER_NUMBER_PREFIX = 'CP'
ORDER_EXPIRY_MINUTES = 30  # Minutes before unpaid order expires

# Payment settings
PAYMENT_METHODS = {
    'mtn_money': {
        'name': 'MTN Mobile Money',
        'enabled': True,
        'fee_percentage': 0,
    },
    'airtel_money': {
        'name': 'Airtel Money',
        'enabled': True,
        'fee_percentage': 0,
    },
    'cash_on_delivery': {
        'name': 'Cash on Delivery',
        'enabled': True,
        'fee_percentage': 0,
    },
}

# Notification settings
NOTIFICATION_SETTINGS = {
    'order_confirmation': True,
    'order_status_updates': True,
    'marketing_emails': False,  # Opt-in required
    'newsletter': True,
}