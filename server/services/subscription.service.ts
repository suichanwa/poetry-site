import prisma from '../lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const SUBSCRIPTION_PRICES = {
  MONTHLY: 30,
  QUARTERLY: 75,
  SEMI_ANNUAL: 110,
  ANNUAL: 200
};

export class SubscriptionService {
  async createSubscription(userId: number, billingPeriod: BillingPeriod) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true }
    });

    if (!user) throw new Error('User not found');
    
    // Create Stripe customer if doesn't exist
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id.toString() }
      });

      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customer.id }
      });
    }

    const price = SUBSCRIPTION_PRICES[billingPeriod];
    const endDate = this.calculateEndDate(billingPeriod);

    // Create subscription in database
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        tier: 'PREMIUM',
        billingPeriod,
        price,
        endDate,
        status: 'ACTIVE'
      }
    });

    return subscription;
  }

  private calculateEndDate(billingPeriod: BillingPeriod): Date {
    const now = new Date();
    switch (billingPeriod) {
      case 'MONTHLY':
        return new Date(now.setMonth(now.getMonth() + 1));
      case 'QUARTERLY':
        return new Date(now.setMonth(now.getMonth() + 3));
      case 'SEMI_ANNUAL':
        return new Date(now.setMonth(now.getMonth() + 6));
      case 'ANNUAL':
        return new Date(now.setFullYear(now.getFullYear() + 1));
    }
  }
}