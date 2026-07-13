import { deleteDoc, orderBy, setDoc, updateDoc } from "firebase/firestore";
import { cleanUndefined, documentRef, getCollection } from "@/services/firebase/firestore";
import type { Vote } from "@/types";

export function listVotes() {
  return getCollection<Vote>("votes", [orderBy("startDate", "desc")]);
}

export async function createVote(vote: Vote) {
  await setDoc(documentRef("votes", vote.id), cleanUndefined(vote));
}

export async function updateVote(vote: Vote) {
  await updateDoc(documentRef("votes", vote.id), cleanUndefined(vote));
}

export async function removeVote(id: string) {
  await deleteDoc(documentRef("votes", id));
}
