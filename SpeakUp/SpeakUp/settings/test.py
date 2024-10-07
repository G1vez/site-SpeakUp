from .base import *

DEBUG = True

ALLOWED_HOSTS = env.list('DJANGO_ALLOWED_HOSTS', default=['speakup.in.ua'])

DATABASES = {
    'default': env.db('TEST_DATABASE_URL'),
}
