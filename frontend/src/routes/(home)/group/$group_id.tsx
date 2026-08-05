import { GroupDetailPage } from '@/pages/group/GroupDetail.page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(home)/group/$group_id')({
  component: GroupDetailPage,
})
