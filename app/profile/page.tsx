"use client";

import {usePrivy} from "@privy-io/react-auth";
import {useUserContext} from "@/providers/user-context-provider";
import {Button} from "@/components/ui/button";
import ValueBadge from "@/components/ui/value-badge";
import {useEffect, useState} from "react";
import useValuesHook from "../hooks/useValuesHook";
import {NFT_CONTRACT_ADDRESS} from "@/constants";
import {Link as LinkIcon} from "lucide-react";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ProfilePage = () => {
  const {authenticated, login, ready, user} = usePrivy();
  const {userInfo, isLoading, setUserInfo} = useUserContext();

  const {fetchUser} = useValuesHook();
  useEffect(() => {
    const fetchUserData = async () => {
      const user = (await fetchUser()).user;
      if (user) setUserInfo(user);
    };

    fetchUserData();
  }, [user]);

  return (
    <div className="p-4">
      {authenticated && userInfo && !isLoading && (
        <div>
          <h2 className="scroll-m-20 text-center border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-muted-foreground mb-2">
            || profile
          </h2>

          <div>
            <h3 className="flex items-center gap-2">
              <span className="font-semibold">
                Hello {user?.farcaster?.displayName}
              </span>{" "}
              <Link
                href={`https://testnets.opensea.io/assets/base-sepolia/${NFT_CONTRACT_ADDRESS}/${userInfo.profileNft}`}
                target="_blank"
              >
                <LinkIcon className="m-0 p-0 text-primary" size={"18px"} />
              </Link>
            </h3>

            <Table className="border-[1px] border-gray-400   m-auto mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] md:w-[200px] max-w-[400px]">
                    Value
                  </TableHead>

                  <TableHead>Weight</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userInfo.mintedValues &&
                  userInfo.mintedValues
                    .sort((a, b) => Number(b.weightage) - Number(a.weightage))
                    .map((value) => (
                      <TableRow key={value.value}>
                        <TableCell className="font-medium">
                          <ValueBadge value={value.value} />
                        </TableCell>

                        <TableCell>{Number(value?.weightage) ?? 1}</TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      {ready && !authenticated && (
        <section className="w-full mt-24  flex flex-col items-center ">
          <span className="scroll-m-20 text-lg font-semibold tracking-tight ">
            Login to view your profile
          </span>
          <Button
            variant="default"
            onClick={login}
            disabled={!ready || authenticated || isLoading}
            className="my-4"
          >
            {isLoading ? "Loading.." : "Login"}
          </Button>
        </section>
      )}
      {!ready ||
        (isLoading && (
          <section className="w-full mt-24  flex flex-col items-center ">
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-primary"></div>
              <span>Loading</span>
            </div>
          </section>
        ))}
    </div>
  );
};

export default ProfilePage;
