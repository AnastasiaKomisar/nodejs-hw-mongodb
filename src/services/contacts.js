import { SORT_ORDER } from '../constants/index.js';
import { ContactsCollection } from '../db/models/contactModel.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1, 
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'name',
}) => {
  const limit = perPage;
  const skip = (page-1)*perPage;

  const contactsQuery = ContactsCollection.find();
  const contactsCount = await ContactsCollection.find().merge(contactsQuery).countDocuments();

  const contacts = await contactsQuery.skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId) => {
  const contacts = await ContactsCollection.findById(contactId);
  return contacts;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload) => {
  const rawResult = await ContactsCollection.findByIdAndUpdate(
    {_id: contactId},
    payload,
    { new: true }
  );
 
  if (!rawResult) return null;

  return {
    contact: rawResult,
  };

};

export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findByIdAndDelete({_id: contactId});
  return contact;
};