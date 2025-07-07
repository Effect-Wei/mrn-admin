/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/07 20:28:50
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Role } from '@/modules/role/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ default: true })
  enable: boolean;

  @Column({ type: 'varchar', length: 20, nullable: true, comment: '用户绑定的QQ号' })
  qq: string;

  @Column('int', { default: 0, comment: '用户点数' })
  points: number;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @OneToOne(() => Profile, (profile) => profile.user, {
    createForeignKeyConstraints: false,
    cascade: true,
  })
  profile: Profile;

  @ManyToMany(() => Role, (role) => role.users, {
    createForeignKeyConstraints: false,
  })
  @JoinTable()
  roles: Role[];
}
