from django.urls import path, include
from . import views
from rest_framework import routers


router = routers.DefaultRouter()
router.register('polygondata',views.PolygonDataViewSet)
# router.register('pointdata',views.PointDataViewSet)
router.register('soildata',views.SoilDataViewSet)
router.register('ownerdata',views.OwnerDataViewSet)
router.register('cropcode',views.CropCodeViewSet)

app_name = 'apiv1'
urlpatterns = [
    path('', include(router.urls)),
]