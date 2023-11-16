import { Request, Response } from 'express';
import { removeFile } from '../GoogleStorage/GoogleStorage.api.handlers';
import { Event } from '../../models/Event';

export const registerEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.create({ ...req.body });
    return res.json({ success: true, data: event });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
};

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit);
    const offset = Number(req.query.offset);
    const eventsCount = await Event.collection.countDocuments();
    const currentLimit = limit === 0 ? eventsCount : limit;
    const events = await Event.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: offset },
      { $limit: currentLimit },
    ]).exec();
    return res.send({ data: events, count: eventsCount });
  } catch {
    res.send({ success: false, error: 'Event does not exist!' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    return res.send({ data: event, success: true });
  } catch {
    res.send({ success: false, error: 'Event does not exist!' });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.send({ success: true, data: event });
  } catch {
    res.send({ success: false, error: 'Event does not exist!' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const eventDelete = await Event.deleteOne({ _id: id });

    if (eventDelete.ok && eventDelete.iconUrl) {
      const url = eventDelete?.iconUrl.substring(eventDelete?.iconUrl.lastIndexOf('/') + 1);

      removeFile(url);
    }

    return res.send({ success: true });
  } catch (err) {
    res.send({ success: false, error: err });
  }
};
