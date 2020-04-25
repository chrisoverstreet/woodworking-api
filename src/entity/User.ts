import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsDate, IsEmail, IsUUID } from 'class-validator';

@Entity()
// eslint-disable-next-line import/prefer-default-export
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id!: string;

  @Column({ nullable: false, unique: true })
  firebaseUid!: string;

  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false, unique: true })
  @IsEmail()
  email!: string;

  @CreateDateColumn({ nullable: false, type: 'timestamp with time zone' })
  @IsDate()
  createdAt!: Date;

  @UpdateDateColumn({ nullable: false, type: 'timestamp with time zone' })
  @IsDate()
  updatedAt!: Date;
}
