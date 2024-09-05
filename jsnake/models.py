from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Score(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, default="", related_name="user_scores")
    value = models.IntegerField(default=0, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    difficulty = models.CharField(max_length=4, default="")
    def serialize(self):
        return {
            "id": self.id,
            "scorer": self.user.username,
            "value": self.value,
            "timestamp": self.timestamp.strftime("%b. %d, %Y, %H:%M %p"),
            "difficulty": self.difficulty
        }
class Comment(models.Model):
    content = models.TextField()
    autor = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, default="", related_name="user_comments")
    publication_date = models.DateTimeField(auto_now_add=True)
    def serialize(self):
        return {
            "id": self.id,
            "autor": self.autor.username,
            "content": self.content,
            "publication_date": self.publication_date.strftime("%b. %d, %Y, %H:%M %p")
        }

