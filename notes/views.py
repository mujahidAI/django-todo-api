from django.shortcuts import render
from rest_framework import viewsets
from .models import Todo
from .serializers import TodoSerializer, TodoCreateSerializer
from rest_framework.response import Response
from rest_framework import status


def home(request):
    return render(request, "home.html")


class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all().order_by("-updated_at")
    serializer_class = TodoSerializer

# Use TodoCreateSerializer on create so is_completed is hidden
    def get_serializer_class(self):
        if self.action == "create":
            return TodoCreateSerializer
        return TodoSerializer   
