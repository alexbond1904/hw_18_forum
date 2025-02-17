import {
    Body,
    Controller,
    Delete,
    Get,
    HeaderParam,
    Param,
    Post,
    Put,
    Req,
    UseAfter,
    UseBefore
} from "routing-controllers";
import UserService from "../service/UserService";
import UserServiceImpl from "../service/UserServiceImpl";
import NewUserDto from "../dto/NewUserDto";
import {authMiddleware} from "../middlware/authenticationMiddlware";
import UpdateUserDto from "../dto/UpdateUserDto";
import {roleMiddleware} from "../middlware/roleMiddlware";
import {accountOwnerMiddleware} from "../middlware/accountOwnerMiddleware";
import {CustomErrorHandler} from "../../forum/middlware/CustomErrorHandler";


@Controller('/account')
@UseAfter(CustomErrorHandler)
export default class UserController {

    userService:UserService = new UserServiceImpl();


    @Post("/register")
    async register(@Body() newUserDto:NewUserDto){
        return this.userService.register(newUserDto);
    }

    @Delete("/user/:login")
    @UseBefore(authMiddleware, accountOwnerMiddleware)
    async removeUser(@Param('login') login: string) {
        return this.userService.removeUser(login);
    }

    @Get("/user/:login")
    @UseBefore(authMiddleware)
    async getUser(@Param('login') login: string) {
        return this.userService.getUser(login);
    }

    @Put("/user/:login")
    @UseBefore(authMiddleware, accountOwnerMiddleware)
    async updateUser(@Param('login') login: string, @Body() updateUser: UpdateUserDto) {
        return this.userService.updateUser(login,updateUser.firstName, updateUser.lastName);
    }

    @Put("/user/:login/role/:role")
    @UseBefore(authMiddleware, roleMiddleware('admin'))
    async addRole(@Param('login') login: string, @Param('role') role: string) {
        return this.userService.addRole(login, role);
    }

    @Delete("/user/:login/role/:role")
    @UseBefore(authMiddleware, roleMiddleware('admin'))
    async removeRole(@Param('login') login: string, @Param('role') role: string) {
        return this.userService.removeRole(login, role);
    }

    @Post('/login')
    async login(@Body() loginDto: {login: string, password:string}) {
        const token = await this.userService.login(loginDto.login, loginDto.password);
        return {token}
    }

    @Put('/password')
    @UseBefore(authMiddleware)
    async changePassword(
        @HeaderParam('currentPassword') currentPassword: string,
        @HeaderParam('newPassword') newPassword: string,
        @Req() req: any,)
    {
        return this.userService.changePassword(req.user.login, currentPassword, newPassword)
    }

    @Get('/getAllUsers')
    async getAllUsers() {
        return this.userService.getAllUsers();
    }
}