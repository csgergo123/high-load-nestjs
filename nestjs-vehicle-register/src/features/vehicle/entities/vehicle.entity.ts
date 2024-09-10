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
}

const VehicleSchema = SchemaFactory.createForClass(Vehicle);

export { VehicleSchema };
