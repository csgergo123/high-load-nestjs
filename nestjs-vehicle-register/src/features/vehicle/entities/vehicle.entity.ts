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
  @Prop({ required: true, unique: true, index: true })
  rendszam: string;

  @ApiProperty()
  @Prop({ required: true, index: true })
  tulajdonos: string;

  @ApiProperty()
  @Prop({ required: true })
  forgalmi_ervenyes: string;

  @ApiProperty()
  @Prop({ type: [String], index: true })
  adatok: string[];
}

const VehicleSchema = SchemaFactory.createForClass(Vehicle);

// VehicleSchema.index(
//   { rendszam: 1, tulajdonos: 1, adatok: 1 },
//   { collation: { locale: 'hu', strength: 2 } },
// );

export { VehicleSchema };
