from rest_framework import serializers
from backend.models import PolygonData,OwnerData,CropCode

class PolygonDataSerializer(serializers.ModelSerializer):

    class Meta:
        model = PolygonData
        fields = '__all__'

class OwnerDataSerializer(serializers.ModelSerializer):

    class Meta:
        model = OwnerData
        fields = '__all__'

class CropCodeSerializer(serializers.ModelSerializer):

    class Meta:
        model = CropCode
        fields = '__all__'