from .base import *

DEBUG = False

ALLOWED_HOSTS = env.list('DJANGO_ALLOWED_HOSTS', default=['speakup.in.ua'])

DATABASES = {
    'default': env.db(),
}
