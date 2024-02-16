import { EventFormat, EventFormatOptions } from '@/lib/event-data';
import typia from 'typia';

export const isFormatClimbing = typia.createIs<EventFormat<'climbing'>>();
export const isFormatIceSkating = typia.createIs<EventFormat<'ice-skating'>>();

export const validateFormatClimbing = typia.createValidate<EventFormat<'climbing'>>();
export const validateFormatIceSkating = typia.createValidate<EventFormat<'ice-skating'>>();

export const parseFormatClimbing = typia.json.createIsParse<EventFormat<'climbing'>>();
export const parseFormatIceSkating = typia.json.createIsParse<EventFormat<'ice-skating'>>();

// format options

export const isFormatOptionsClimbing = typia.createIs<EventFormatOptions<'climbing'>>();
export const isFormatOptionsIceSkating = typia.createIs<EventFormatOptions<'ice-skating'>>();

export const validateFormatOptionsClimbing = typia.createValidate<EventFormatOptions<'climbing'>>();
export const validateFormatOptionsIceSkating =
  typia.createValidate<EventFormatOptions<'ice-skating'>>();
