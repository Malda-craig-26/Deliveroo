from . import db

class Parcel(db.Model):
    __tablename__ = "parcels"

    id = db.Column(db.Integer, primary_key=True)
    weight = db.Column(db.Float, nullable=False)
    pickup_location = db.Column(db.String, nullable=False)
    destination = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    status_id = db.Column(db.Integer, db.ForeignKey("statuses.id"))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    location_id = db.Column(db.Integer, db.ForeignKey("locations.id"))

    user = db.relationship("User", back_populates="parcels")
    status = db.relationship("Status", back_populates="parcels")
    location = db.relationship("Location", back_populates="parcels")
