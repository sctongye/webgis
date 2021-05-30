from django.contrib.gis.db import models

class PolygonData(models.Model):

    class Meta:
        db_table = 'polygon_data'

    polygon = models.GeometryField()
    year = models.CharField(max_length=4)
    owner_id = models.ForeignKey("OwnerData",on_delete=models.CASCADE)
    crop_id = models.ForeignKey("CropCode", on_delete=models.CASCADE)
    remarks = models.CharField(max_length=100)


class OwnerData(models.Model):

    class Meta:
        db_table = 'owner_data'
    
    owner_id = models.IntegerField()
    owner_name = models.CharField(max_length=50)

    def __str__(self):
        return self.owner_name


class CropCode(models.Model):

    class Meta:
        db_table = 'crop_code'

    crop_id = models.IntegerField()
    crop_name = models.CharField(max_length=50)

    def __str__(self):
        return self.crop_name

class SoilData(models.Model):

    class Meta:
        db_table = 'soil_data'

    point = models.GeometryField(unique=True)
    date = models.DateField()
    ph = models.FloatField()
    nitrogen = models.FloatField()
    phosphoric_acid = models.FloatField()
    potassium = models.FloatField()
    magnesium = models.FloatField()
    calsium = models.FloatField()
    remarks =models.CharField(max_length=100)
    