from rest_framework import viewsets
from backend.models import PolygonData,OwnerData,CropCode
from .serializers import PolygonDataSerializer,OwnerDataSerializer,CropCodeSerializer

class PolygonDataViewSet(viewsets.ModelViewSet):

    queryset = PolygonData.objects.all()
    serializer_class = PolygonDataSerializer

class OwnerDataViewSet(viewsets.ModelViewSet):

    queryset = OwnerData.objects.all()
    serializer_class = OwnerDataSerializer

class CropCodeViewSet(viewsets.ModelViewSet):

    queryset = CropCode.objects.all()
    serializer_class = CropCodeSerializer
