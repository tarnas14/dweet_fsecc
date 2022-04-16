-- DropForeignKey
ALTER TABLE "UsersInWorkspaces" DROP CONSTRAINT "UsersInWorkspaces_userId_fkey";

-- DropForeignKey
ALTER TABLE "UsersInWorkspaces" DROP CONSTRAINT "UsersInWorkspaces_workspaceId_fkey";

-- AddForeignKey
ALTER TABLE "UsersInWorkspaces" ADD CONSTRAINT "UsersInWorkspaces_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInWorkspaces" ADD CONSTRAINT "UsersInWorkspaces_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
