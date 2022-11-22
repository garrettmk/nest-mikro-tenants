import { Id, PropertiesMetadataManager } from '@garrettmk/class-schema';
import cuid, { isCuid } from 'cuid';
import 'reflect-metadata';
import { Event, EventType } from '../lib/core-domain';

Id.isId = function (value: unknown): value is Id {
  return typeof value === 'string' && isCuid(value);
}

Id.fake = function (): string {
  return cuid();
}



describe('Event', () => {
  const validEvents: Event[] = [
    { id: cuid(), type: EventType.Create, objectId: cuid(), createdAt: new Date() },
    { id: cuid(), type: EventType.Update, objectId: cuid(), createdAt: new Date() },

  ];

  const invalidEvents = [
    { ...validEvents[0], id: '' },
    { ...validEvents[0], createdAt: null }
  ] as Event[];

  it('should have metadata', () => {
    const metadata = PropertiesMetadataManager.getMetadata(Event);
    // const metadata = getMetadataStorage().getTargetValidationMetadatas(Event, '', true, false);
    console.log(metadata);
  });

  it.each(validEvents)('should validate', async value => {
    expect.assertions(1);

    await expect(Event.from(value)).resolves.toBeInstanceOf(Event);
  });

  it.each(invalidEvents)('should not validate', async value => {
    expect.assertions(1);

    // await expect(transformAndValidate(Event, value)).rejects.toBeInstanceOf(Array);
    await expect(Event.from(value)).rejects.toBeInstanceOf(Array);
  });

  it('should create a fake Event', () => {
    const fake = Event.fake();
    console.log(fake);
    
    expect(fake).toBeDefined();
  })
});