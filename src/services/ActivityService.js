import apiClient from './apiClient';
const root='/activities';
const data=r=>r.data;
export const listActivities=groupId=>apiClient.get(`${root}/group/${groupId}`).then(data);
export const createActivity=(groupId,body)=>apiClient.post(`${root}/group/${groupId}`,body).then(data);
export const getActivity=id=>apiClient.get(`${root}/${id}`).then(data);
export const setExclusions=(id,excludedUserIds)=>apiClient.put(`${root}/${id}/exclusions`,{excludedUserIds}).then(data);
export const setNumbers=(id,assignments)=>apiClient.put(`${root}/${id}/numbers`,{assignments}).then(data);
export const drawActivity=id=>apiClient.post(`${root}/${id}/draw`).then(data);
