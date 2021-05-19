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