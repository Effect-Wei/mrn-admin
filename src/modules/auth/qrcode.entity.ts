import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('qrcodes')
export class QRCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  creatorId: number;

  @Column({ default: true })
  isValid: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
