import * as removeAccents from 'remove-accents';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types as MongooseTypes } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({
  autoIndex: true,
  versionKey: false,
})
export class Vehicle extends Document {
  id: MongooseTypes.ObjectId;

  @ApiProperty()
  @Prop({ default: uuidv4, unique: true, index: true })
  uuid: string;

  @ApiProperty()
  @Prop({ unique: true, index: true })
  rendszam: string;

  @ApiProperty()
  @Prop()
  tulajdonos: string;

  @ApiProperty()
  @Prop()
  forgalmi_ervenyes: string;

  @ApiProperty()
  @Prop({ type: [String] })
  adatok: string[];

  // Készítünk egy új mezőt, amibe elmentjük a rendszam, tulajdonos és adatok mezők értékét egybe, hogy könnyebben lehessen rájuk keresni.
  @Prop({ index: true })
  searchText: string;
}

const VehicleSchema = SchemaFactory.createForClass(Vehicle);

VehicleSchema.pre('save', function (next) {
  this.searchText = removeAccents(
    `${this.rendszam.toLowerCase()} ${this.tulajdonos.toLowerCase()} ${this.adatok.join(' ').toLowerCase()}`,
  );
  next();
});

export { VehicleSchema };
