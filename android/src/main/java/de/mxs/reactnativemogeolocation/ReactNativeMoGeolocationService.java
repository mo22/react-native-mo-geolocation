package de.mxs.reactnativemogeolocation;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

public final class ReactNativeMoGeolocationService extends Service {

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager notificationManager = (NotificationManager)getSystemService(NOTIFICATION_SERVICE);
            if (notificationManager == null) throw new RuntimeException("notificationManager null");
            NotificationChannel channel = new NotificationChannel("ReactNativeMoGeolocationService", "background", NotificationManager.IMPORTANCE_NONE);
            channel.setImportance(NotificationManager.IMPORTANCE_NONE);
            channel.setLockscreenVisibility(Notification.VISIBILITY_PRIVATE);
            notificationManager.createNotificationChannel(channel);
        }
        Context context = this;
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, "ReactNativeMoGeolocationService");
        builder.setOngoing(false);
        builder.setCategory(NotificationCompat.CATEGORY_SERVICE);
        builder.setPriority(NotificationCompat.PRIORITY_MIN);
        builder.setSmallIcon(getApplicationContext().getResources().getIdentifier("ic_launcher", "mipmap", getApplicationContext().getPackageName()));

        Intent intent = getApplicationContext().getPackageManager().getLaunchIntentForPackage(getApplicationContext().getPackageName());
//        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_ONE_SHOT);
        builder.setContentIntent(pendingIntent);

        startForeground(100, builder.build());
    }

}
