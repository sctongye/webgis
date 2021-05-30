from rest_framework import viewsets
from backend.models import PolygonData,OwnerData,CropCode,SoilData
from .serializers import PolygonDataSerializer,OwnerDataSerializer,CropCodeSerializer,SoilDataSerializer


class PolygonDataViewSet(viewsets.ModelViewSet):

    queryset = PolygonData.objects.all()
    # queryset = PolygonData.objects.filter(crop_id__crop_name='大豆')
    serializer_class = PolygonDataSerializer

class OwnerDataViewSet(viewsets.ModelViewSet):

    queryset = OwnerData.objects.all()
    serializer_class = OwnerDataSerializer

class CropCodeViewSet(viewsets.ModelViewSet):

    queryset = CropCode.objects.all()
    serializer_class = CropCodeSerializer


# class PointDataViewSet(viewsets.ModelViewSet):

#     queryset = PointData.objects.all()
#     serializer_class = PointDataSerializer


class SoilDataViewSet(viewsets.ModelViewSet):

    queryset = SoilData.objects.all()
    serializer_class = SoilDataSerializer

