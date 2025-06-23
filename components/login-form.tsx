"use client"

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import crabe from '../public/crabe.png';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form className='p-6 md:p-8'>
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col items-center text-center'>
                <h1 className='text-2xl font-bold'>Bienvenue</h1>
                <p className='text-muted-foreground text-balance'>
                  Login to your Acme Inc account
                </p>
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  required
                />
              </div>
              <div className='grid gap-3'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>Password</Label>
                  <a
                    href='#'
                    className='ml-auto text-sm underline-offset-2 hover:underline'
                  >
                    Mot de passe oublie?
                  </a>
                </div>
                <Input id='password' type='password' required />
              </div>
              <Button type='submit' className='w-full'>
                Se connecter
              </Button>

              <div className='text-center text-sm'>
                Vous n&apos;avez pas de compte?{' '}
                <a href='#' className='underline underline-offset-4'>
                  S&apos;inscrire
                </a>
              </div>
            </div>
          </form>
          <div className='bg-muted relative hidden md:block'>
            <Image
              width={500}
              height={500}
              src={crabe}
              alt='Login Illustration'
              className='object-cover w-full h-full'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
