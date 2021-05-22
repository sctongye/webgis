from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from backend.models import PolygonData,OwnerData,CropCode

class PolygonDataSerializer(GeoFeatureModelSerializer):

    class Meta:
        model = PolygonData
        fields = '__all__'
        geo_field = 'polygon'

class OwnerDataSerializer(serializers.ModelSerializer):

    class Meta:
        model = OwnerData
        fields = '__all__'

class CropCodeSerializer(serializers.ModelSerializer):

    class Meta:
        model = CropCode
        fields = '__all__'