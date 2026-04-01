import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

abstract class BaseBlocPage<B extends BlocBase<S>, S> extends StatelessWidget {
  const BaseBlocPage({super.key});

  B createBloc(BuildContext context);

  void initBloc(BuildContext context, B bloc) {}

  Widget buildPage(BuildContext context);

  @override
  Widget build(BuildContext context) {
    return BlocProvider<B>(
      create: (ctx) {
        final bloc = createBloc(ctx);
        initBloc(ctx, bloc);
        return bloc;
      },
      child: Builder(builder: buildPage),
    );
  }
}
