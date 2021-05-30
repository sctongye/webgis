from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from backend.models import PolygonData,OwnerData,CropCode,SoilData


class PolygonDataSerializer(GeoFeatureModelSerializer):

    # owner_id = serializers.ReadOnlyField(source='owner_id.owner_name')
    # crop_id = serializers.ReadOnlyField(source='crop_id.crop_name')

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


# class PointDataSerializer(GeoFeatureModelSerializer):

#     class Meta:
#         model = PointData
#         fields = '__all__'
#         geo_field = 'point'


class SoilDataSerializer(GeoFeatureModelSerializer):

    # point,date,nitrogen,phosphoric_acid,potassium,magnesium,calsium

    # point = PointDataSerializer()

    class Meta:
        model = SoilData
        fields = '__all__'
        geo_field = 'point'