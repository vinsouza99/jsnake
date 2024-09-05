from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name="home"),
    path('play', views.play, name="play"),
    path('scores', views.scores, name="scores"),
    path('source', views.source, name="source"),
    path('save', views.save_score, name="save"),
    path('login', views.login_view, name="login"),
    path('logout', views.logout_view, name='logout'),
    path('register', views.register, name="register"),
    path('comment', views.comment, name="post_comment"),
    path('join', views.login_register_render, name="join"),
    path('getscore/<str:dif>', views.get_highscore, name="highscore"),
    path('scores/<str:dif>/<int:pagenumber>', views.load_scores, name="load"),
    path('comments/<int:pagenumber>', views.load_comments, name="load_comments")
]