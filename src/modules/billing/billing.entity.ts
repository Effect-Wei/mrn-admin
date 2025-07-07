import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '@/modules/user/user.entity';

@Entity()
export class BillingIntervals {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  startTime: Date;

  @Column({ nullable: true })
  endTime: Date;

  @Column({ default: 1 })
  rate: number;

  @Column('int', { nullable: true })
  amount: number;

  @Column({ nullable: true })
  startLocation: string;

  @Column({ nullable: true })
  endLocation: string;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;
}

@Entity()
export class OneTimeBilling {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  timestamp: Date;

  @Column('int')
  amount: number;

  @Column({ nullable: true })
  location: string;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;
}
