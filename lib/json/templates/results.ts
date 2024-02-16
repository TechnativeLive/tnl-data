import { EventFormat, EventResults } from '@/lib/event-data';
import typia from 'typia';

export const isResultsClimbing = typia.createIs<EventResults<'climbing'>>();
export const isResultsIceSkating = typia.createIs<EventResults<'ice-skating'>>();

export const validateResultsClimbing = typia.createValidate<EventResults<'climbing'>>();
export const validateResultsIceSkating = typia.createValidate<EventResults<'ice-skating'>>();

export const parseResultsClimbing = typia.json.createValidateParse<EventFormat<'climbing'>>();
export const parseResultsIceSkating = typia.json.createValidateParse<EventFormat<'ice-skating'>>();
