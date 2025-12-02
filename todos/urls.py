from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("todos/<int:pk>/", views.todo_detail_page, name="todo_detail"),
]
