"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import useWcaApi from "../../hooks/useWcaApi";
import { Competition } from "@wca/helpers";
import classNames from "classnames";

type APICompetition = {
  id: string;
  name: string;
};

export const Competitions = () => {
  const { user, apiFetch } = useWcaApi();
  const [competitions, setCompetitions] = useState<APICompetition[]>([]);
  const [wcifs, setWcifs] = useState<Record<string, Competition>>({});

  const getCompetitions = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    const data = (await apiFetch(
      `/competitions?managed_by_me=true`
    )) as APICompetition[];

    setCompetitions(data);

    const _wcifs = await Promise.all(
      data.map(async (comp) => {
        const wcif = await apiFetch(`/competitions/${comp.id}/wcif`);
        return { [comp.id]: wcif };
      })
    );

    setWcifs(Object.assign({}, ..._wcifs));
  }, [apiFetch, user?.id]);

  useEffect(() => {
    getCompetitions();
  }, [getCompetitions]);

  const uniquePersons = useMemo(() => {
    const persons = new Set<string>();

    for (const comp of Object.values(wcifs)) {
      for (const person of comp.persons) {
        persons.add(person.name);
      }
    }

    return Array.from(persons).sort();
  }, [wcifs]);

  const upcomingCompetitions = useMemo(
    () =>
      Object.keys(wcifs)
        .map((id) => {
          const comp = wcifs[id];

          return comp;
        })
        .filter((comp) => {
          const now = new Date();
          const startDate = new Date(comp.schedule.startDate);
          return startDate > now;
        })
        .sort((a, b) =>
          a.schedule.startDate.localeCompare(b.schedule.startDate)
        ),
    [wcifs]
  );

  console.log(69, upcomingCompetitions);

  return (
    <div className="flex flex-col h-full">
      <div
        className="grid border-b-2 "
        style={{
          gridTemplateColumns: `repeat(${
            upcomingCompetitions.length + 1
          }, minmax(0, 1fr))`,
        }}
      >
        <div className="col-span-1 p-1">Name</div>
        {upcomingCompetitions.map((comp) => (
          <div key={comp.id} className="col-span-1 p-1 flex flex-col">
            <span className="font-semibold">
              {comp.name.replace(/2023|2024/, "")}
            </span>
            <span>{comp.schedule.startDate}</span>
          </div>
        ))}
        <div className="col-span-1 p-1">{uniquePersons.length}</div>
        {upcomingCompetitions.map((comp) => (
          <div key={comp.id} className="col-span-1 p-1">
            {
              comp.persons.filter((p) => p.registration?.status === "accepted")
                .length
            }
          </div>
        ))}
      </div>
      <div
        className="grid overflow-y-scroll w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${
            upcomingCompetitions.length + 1
          }, minmax(0, 1fr))`,
        }}
      >
        {uniquePersons.map((person, index) => (
          <div key={person} className="group contents">
            <div
              className={classNames("col-span-1 p-1 group-hover:bg-slate-100", {
                "bg-gray-50": index % 2 === 0,
              })}
            >
              {person}
            </div>
            {upcomingCompetitions.map((comp) => (
              <div
                key={comp.id}
                className={classNames(
                  "col-span-1 p-1 group group-hover:bg-slate-100",
                  {
                    "bg-gray-50": index % 2 === 0,
                  }
                )}
              >
                {
                  comp.persons.find((p) => p.name === person)?.registration
                    ?.status
                }
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
