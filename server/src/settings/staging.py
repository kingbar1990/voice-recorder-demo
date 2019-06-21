from .base import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': os.environ.get('DATABASE_NAME', 'recorder'),
        'USER': os.environ.get('DATABASE_USER', 'recorder'),
        'PASSWORD': os.environ.get('DATABASE_PASSWORD', 'recorder'),
        'HOST': os.environ.get('DATABASE_HOST', '35.200.165.23'),
        'PORT': os.environ.get('DATABASE_PORT', 5432),
    }
}

DEBUG = True
ALLOWED_HOSTS = ["35.197.203.140"]
CORS_ORIGIN_ALLOW_ALL = True
