import { LoaderFunctionArgs } from "react-router-dom";
import API_URL from "../config";
import { SetType } from "../pages/learn/SetsList";
import { getToken } from "./store";

export async function GetAllSets(): Promise<SetType[]> {
  const token = getToken();
  const res = await fetch(API_URL + "/sets", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  });
  const data = await res.json();
  // if (!res.ok) {
  //   throw new Error(data.message);
  // }

  return data.data;
}

export async function GetSetById({
  params,
}: LoaderFunctionArgs): Promise<SetType> {
  const { id } = params;
  const token = getToken();
  const res = await fetch(API_URL + `/sets/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  });
  const data = await res.json();
  // if (!res.ok) {
  //   throw new Error(data.message);
  // }

  return data.data;
}

export async function GetSavedSets(): Promise<SetType[]> {
  const token = getToken();
  const res = await fetch(API_URL + "/sets/saved", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  });
  const data = await res.json();
  // if (!res.ok) {
  //   throw new Error(data.message);
  // }

  return data.data;
}

export async function GetOwnedSets(): Promise<SetType[]> {
  const token = getToken();
  const res = await fetch(API_URL + "/sets/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  });
  const data = await res.json();

  return data.data || [];
}

interface AllSets {
  browse: SetType[];
  saved: SetType[];
  mine: SetType[];
}

export async function getSetsByCategory(): Promise<AllSets> {
  const browse = await GetAllSets();
  const saved = await GetSavedSets();
  const mine = await GetOwnedSets();
  return { browse, saved, mine };
}

export function scrollToTop() {
  window.scrollTo(0, 0);
}
