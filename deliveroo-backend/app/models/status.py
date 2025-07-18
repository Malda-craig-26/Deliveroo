from . import db

class Status(db.Model):
    __tablename__ = "statuses"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    parcels = db.relationship("Parcel", back_populates="status")
