from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.shortcuts import render
from django.db.models import Max
from django.urls import reverse
import datetime
import json

from .models import User, Score, Comment

# Create your views here.
def home(request):
    return render(request, 'jsnake/home.html')
def play(request):
    return render(request, 'jsnake/play.html')
def scores(request):
    return render(request, 'jsnake/scores.html')
def source(request):
    return render(request, 'jsnake/source.html')
def login_register_render(request):
    return render(request, 'jsnake/login_register.html')

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("home"))
        else:
            return render(request, "jsnake/login_register.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "jsnake/login_register.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("home"))

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request,  "jsnake/login_register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:                
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "jsnake/login_register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("home"))
    else:
        return render(request, "jsnake/login_register.html")

@csrf_exempt
def save_score(request):
    if request.method == "POST":
        data = json.loads(request.body)
        scorer = request.user
        score_value = data.get("score")
        dif = data.get("difficulty")
        play_date = datetime.datetime.now().strftime("%b. %d, %Y, %H:%M %p")
        try:
            new_score = Score(user=scorer, value=score_value,difficulty=dif, timestamp=play_date)
            new_score.save()
        except:
            return JsonResponse({"error": "Sorry, there was an error. Try again"}, status=400)
        return HttpResponseRedirect(reverse("scores"))

def get_highscore(request, dif):
    scorer = request.user
    if not scorer.is_authenticated:
        # an user that is not sign in does'nt have any highscore to brag about
        return JsonResponse({"highscore": 'not-user'}, status=201)
    try:
        # if the user is signed in, get the highest score associated with his/her username
        query = Score.objects.filter(user=scorer, difficulty=dif).aggregate(Max('value'))
        highscore = query['value__max']
    except:
        #an exception is only thrown if the user has no highscore yet
        return JsonResponse({"highscore": -1}, status=201)
    return JsonResponse({"highscore": f"{highscore}"}, status=201)

def load_scores(request,dif,pagenumber):
    all_scores = Score.objects.filter(difficulty=dif).order_by("-value").all()
    paginator = Paginator(all_scores, 10)   
    if pagenumber == 0:
        #if the page number is 0, it means the site is trying to get the number of all the pages, not its content
        num_pages = paginator.num_pages
        return JsonResponse({"pages":f"{num_pages}"}, safe=False)
    else:
        # if not, return its content
        page_obj =  paginator.get_page(pagenumber)
        serialized_scores = [post.serialize() for post in page_obj]
        return JsonResponse(serialized_scores, safe=False)

@csrf_exempt
def comment(request):
    if not request.user.is_authenticated:
         return JsonResponse({"error": "Sign in to comment"}, status=400)
    data = json.loads(request.body)
    comment_autor = request.user
    comment_content = data.get("comment_content")
    comment_date = datetime.datetime.now().strftime("%b. %d, %Y, %H:%M %p")
    try:
        new_comment = Comment(autor=comment_autor, content=comment_content, publication_date=comment_date)
        new_comment.save()
    except:
        return JsonResponse({"error": "Sorry, there was an error. Try again"}, status=400)
    return JsonResponse({"message": "Posted successfully"}, status=201)

def load_comments(request, pagenumber):
    all_comments= Comment.objects.all().order_by("-publication_date").all()
    paginator = Paginator(all_comments, 5)   
    if pagenumber == 0:
        #if the page number is 0, it means the site is trying to get the number of all the pages, not it's content
        num_pages = paginator.num_pages
        num_comments = all_comments.count()
        return JsonResponse({"pages":f"{num_pages}", "num":f"{num_comments}"}, safe=False)
    else:
        # if not, return its content
        page_obj =  paginator.get_page(pagenumber)
        serialized_comments = [post.serialize() for post in page_obj]
        return JsonResponse(serialized_comments, safe=False)