import { Key } from 'react';
import HttpClient from './HttpClient';

interface ItemResponse {
    icon: string
    label: string
    key: Key
    id: string
    basePath?: string
}

interface ListInforamtionResponse {
    items: ItemResponse[]
    refresh?: () => void
};

interface Topic {
    name: string,
    numberId: number,
    icon: string
}

interface CourseData {
    _id: string,
    title: string,
    topic: Topic,
    description: string
}

interface Courses {
    data: CourseData[]
}

const getCourse = async (token: string) => {
    try{
      const { data, status } = await HttpClient.get<Courses>(
        "/api/user/v1/enrolled",
        { headers: { authorization: `bearer ${token}` }}
        );

    if(status === 200) { return coursesToListInformation(data.data)}
    return undefined
      } catch(e) {
          return undefined
      }
}

const courseToItem = (course: CourseData): ItemResponse => {
    return {
        icon: course.topic.icon,
        label: course.title,
        key: course._id,
        id: course._id,
        basePath: "/exam",
    };
}

const coursesToListInformation = (courses: CourseData[]): ListInforamtionResponse => {
    return { items: courses.map(course => courseToItem(course))}
}

export {
    getCourse
}

export type {
    ItemResponse,
    ListInforamtionResponse
}