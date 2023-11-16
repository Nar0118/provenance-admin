import * as mongoose from 'mongoose';
import { dateParser } from '../../util/helpers';

const Schema = mongoose.Schema;
const currentDate = dateParser(new Date());

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: currentDate,
  },
  startDate: {
    type: Date,
    default: null,
  },
  endDate: {
    type: Date,
    default: null,
  },
  location: {
    type: String,
  },
  iconUrl: {
    type: String,
  },
});

export const Event = mongoose.model('Event', eventSchema);
