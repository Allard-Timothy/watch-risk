import { DashboardMain, PageTitle } from "@/components/dashboard-main";

export default function LoginVerifyPage() {
  return (
    <DashboardMain>
      <PageTitle
        kicker="Account"
        title="Check your email"
        subtitle="If you are running locally, copy the magic link from the terminal where pnpm dev is running."
      />
    </DashboardMain>
  );
}
