import React from "react";
import { Bell } from "lucide-react";
import { api } from "../../../../convex/_generated/api";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";
import { useConfirm } from "@/hooks/use-confirm";

export const NotificationDropdown = () => {
  const [acceptConfirm, AcceptConfirmDialog] = useConfirm();
  const [declineConfirm, DeclineConfirmDialog] = useConfirm();

  const { data: notifications } = useQuery(
    convexQuery(api.notifications.getWithProject, {}),
  );
  const { mutate: acceptNotification } = useMutation({
    mutationFn: useConvexMutation(api.notifications.accept),
  });
  const { mutate: declineNotification } = useMutation({
    mutationFn: useConvexMutation(api.notifications.decline),
  });

  /**
   * Handles the acceptance of a notification.
   *
   * This function prompts the user for confirmation before proceeding to accept
   * the notification. If the user confirms, it calls the acceptNotification mutation
   * with the provided notification ID. On success, it displays a success toast message,
   * and on error, it displays an error toast message.
   *
   * @param {Id<"notifications">} notificationId - The ID of the notification to accept.
   * @returns {Promise<void>} - A promise that resolves when the acceptance process is complete.
   */
  const handleAccept = async (notificationId: Id<"notifications">) => {
    const ok = await acceptConfirm();
    if (!ok) return;

    acceptNotification(
      {
        notificationId,
      },
      {
        onSuccess: (data) => {
          if (data) {
            toast.success("Notification accepted");
          }
        },
        onError: () => {
          toast.error("Failed to accept notification");
        },
      },
    );
  };

  /**
   * Handles the decline of a notification.
   *
   * This function prompts the user for confirmation before proceeding to decline
   * the notification. If the user confirms, it calls the declineNotification mutation
   * with the provided notification ID. On success, it displays a success toast message,
   * and on error, it displays an error toast message.
   *
   * @param {Id<"notifications">} notificationId - The ID of the notification to decline.
   * @returns {Promise<void>} - A promise that resolves when the decline process is complete.
   */
  const handleDecline = async (notificationId: Id<"notifications">) => {
    const ok = await declineConfirm();
    if (!ok) return;

    declineNotification(
      {
        notificationId,
      },
      {
        onSuccess: (data) => {
          if (data) {
            toast.success("Notification declined");
          }
        },
        onError: () => {
          toast.error("Failed to decline notification");
        },
      },
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="relative flex items-center justify-center"
          >
            <Bell className="size-5" />
            <div
              className={cn(
                notifications && notifications?.length > 0
                  ? "absolute bottom-0 right-[4px] size-[10px] rounded-full bg-red-500"
                  : "hidden",
              )}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[250px]">
          <DropdownMenuLabel>Project Invites</DropdownMenuLabel>
          {notifications?.length === 0 ? (
            <DropdownMenuItem>No invites available</DropdownMenuItem>
          ) : (
            notifications?.map(
              (notif) =>
                notif.type === "project_invite" && (
                  <div key={notif._id}>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <ProjectInvite
                        name={notif.project.name}
                        handleAccept={() => handleAccept(notif._id)}
                        handleDecline={() => handleDecline(notif._id)}
                      />
                    </DropdownMenuItem>
                  </div>
                ),
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AcceptConfirmDialog
        title="Accept Invite"
        description="Are you sure you want to accept this invite?"
      />
      <DeclineConfirmDialog
        title="Decline Invite"
        description="Are you sure you want to decline this invite?"
        confirmButtonText="Decline"
        variant="destructive"
      />
    </>
  );
};

const ProjectInvite = ({
  name,
  handleAccept,
  handleDecline,
}: {
  name: string;
  handleAccept: () => void;
  handleDecline: () => void;
}) => {
  return (
    <div className="flex w-full items-center justify-between">
      <p className="text-sm font-medium">{name}</p>

      <div className="flex gap-x-2">
        <Button size={"sm"} onClick={handleAccept}>
          Accept
        </Button>
        <Button variant={"destructive"} size={"sm"} onClick={handleDecline}>
          Decline
        </Button>
      </div>
    </div>
  );
};
