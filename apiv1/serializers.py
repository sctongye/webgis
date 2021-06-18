from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from backend.models import PolygonData,OwnerData,CropCode,SoilData
from .modules import serializers_module


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

class SoilDataSerializer(GeoFeatureModelSerializer):

    phosphoric_acid_rate = serializers.SerializerMethodField()
    potassium_rate = serializers.SerializerMethodField()
    magnesium_rate = serializers.SerializerMethodField()

    class Meta:
        model = SoilData
        fields = [
            'id',
            'date',
            'field_name',
            'crop_name',
            'ph',
            'nitrogen',
            'phosphoric_acid',
            'potassium',
            'magnesium',
            'calsium',
            'remarks',
            'phosphoric_acid_rate',
            'potassium_rate',
            'magnesium_rate',
            ]
        geo_field = 'point'

    def get_phosphoric_acid_rate(self,obj):
        return serializers_module.result_P_rate(obj.phosphoric_acid)

    def get_potassium_rate(self,obj):
        return serializers_module.result_K_rate(obj.potassium)

    def get_magnesium_rate(self,obj):
        return serializers_module.result_Mg_rate(obj.magnesium)