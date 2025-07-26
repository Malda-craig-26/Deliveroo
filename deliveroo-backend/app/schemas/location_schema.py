from app import ma
from app.models.location import Location

class LocationSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Location
        load_instance = True
        ordered = True

    id = ma.auto_field()
    name = ma.auto_field()
    created_at = ma.auto_field()
    updated_at = ma.auto_field()
