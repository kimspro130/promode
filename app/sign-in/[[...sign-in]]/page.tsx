import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-primary hover:bg-primary/90',
              card: 'bg-card border border-border',
              headerTitle: 'text-foreground',
              headerSubtitle: 'text-muted-foreground',
              socialButtonsBlockButton: 'border border-border hover:bg-accent',
              formFieldInput: 'bg-background border border-border',
              footerActionLink: 'text-primary hover:text-primary/90'
            }
          }}
        />
      </div>
    </div>
  );
}
