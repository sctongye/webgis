from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from backend.models import PolygonData,OwnerData,CropCode

class PolygonDataSerializer(GeoFeatureModelSerializer):

    owner_id = serializers.ReadOnlyField(source='owner_id.owner_name')
    crop_id = serializers.ReadOnlyField(source='crop_id.crop_name')

    class Meta:
        model = PolygonData
        fields = '__all__'
        # fields = ['id','polygon','year','owner_name','crop_name','remarks']
        geo_field = 'polygon'

class OwnerDataSerializer(serializers.ModelSerializer):

    class Meta:
        model = OwnerData
        fields = '__all__'

class CropCodeSerializer(serializers.ModelSerializer):

    class Meta:
        model = CropCode
        fields = '__all__'